import { useState } from "react";
import Box from "./components/Box/Box";
import Link from "./components/Link/Link";
import Spinner from "./components/Spinner/Spinner";
import Switch from "./components/Switch/Switch";
import Text from "./components/Text/Text";

function App() {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [labeledSwitch, setLabeledSwitch] = useState(true);

  return (
    <Box className="min-h-screen bg-gray-50 p-8">
      <Box className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <Box>
          <Text as="h1" size="4xl" weight="bold" color="primary">
            Core Atom Components
          </Text>
          <Text as="p" size="lg" color="muted" className="mt-2">
            Showcase of all atomic components with CVA
          </Text>
        </Box>

        {/* Text Component */}
        <Box className="space-y-4">
          <Text as="h2" size="2xl" weight="semibold">
            Text Component
          </Text>
          <Box className="space-y-2 p-4 bg-white rounded-lg shadow">
            <Text size="xs">Extra small text</Text>
            <Text size="sm">Small text</Text>
            <Text size="base">Base text (default)</Text>
            <Text size="lg">Large text</Text>
            <Text size="xl">Extra large text</Text>
            <Text size="2xl" weight="bold">
              2XL Bold text
            </Text>
            <Text color="primary">Primary color</Text>
            <Text color="success">Success color</Text>
            <Text color="error">Error color</Text>
            <Text color="warning">Warning color</Text>
            <Text transform="uppercase">Uppercase text</Text>
            <Text decoration="underline">Underlined text</Text>
          </Box>
        </Box>

        {/* Box Component */}
        <Box className="space-y-4">
          <Text as="h2" size="2xl" weight="semibold">
            Box Component
          </Text>
          <Box className="grid grid-cols-3 gap-4">
            <Box
              p={4}
              bg="white"
              borderRadius="lg"
              shadow="sm"
              className="border border-gray-200"
            >
              <Text>Box with padding</Text>
            </Box>
            <Box p={4} bg="blue-50" borderRadius="xl" shadow="md">
              <Text>Colored box</Text>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}
              bg="white"
              borderRadius="full"
              shadow="lg"
              h={20}
            >
              <Text>Centered content</Text>
            </Box>
          </Box>
        </Box>

        {/* Spinner Component */}
        <Box className="space-y-4">
          <Text as="h2" size="2xl" weight="semibold">
            Spinner Component
          </Text>
          <Box className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size="xl" />
            <Box className="flex gap-4 ml-8">
              <Spinner color="primary" />
              <Spinner color="secondary" />
              <Spinner color="success" />
              <Spinner color="error" />
              <Spinner color="warning" />
            </Box>
          </Box>
        </Box>

        {/* Switch Component */}
        <Box className="space-y-4">
          <Text as="h2" size="2xl" weight="semibold">
            Switch Component
          </Text>
          <Box className="space-y-4 p-4 bg-white rounded-lg shadow">
            <Box className="flex items-center gap-4">
              <Switch
                size="sm"
                checked={switchChecked}
                onChange={setSwitchChecked}
              />
              <Switch
                size="md"
                checked={switchChecked}
                onChange={setSwitchChecked}
              />
              <Switch
                size="lg"
                checked={switchChecked}
                onChange={setSwitchChecked}
              />
            </Box>
            <Box className="flex items-center gap-4">
              <Switch
                color="primary"
                checked={switchChecked}
                onChange={setSwitchChecked}
              />
              <Switch
                color="secondary"
                checked={switchChecked}
                onChange={setSwitchChecked}
              />
              <Switch
                color="success"
                checked={switchChecked}
                onChange={setSwitchChecked}
              />
              <Switch
                color="error"
                checked={switchChecked}
                onChange={setSwitchChecked}
              />
              <Switch
                color="warning"
                checked={switchChecked}
                onChange={setSwitchChecked}
              />
            </Box>
            <Box className="space-y-2">
              <Switch
                label="Switch with label"
                checked={labeledSwitch}
                onChange={setLabeledSwitch}
              />
              <Switch
                label="Left label position"
                labelPosition="left"
                checked={labeledSwitch}
                onChange={setLabeledSwitch}
              />
              <Switch label="Disabled switch" disabled checked={true} />
            </Box>
          </Box>
        </Box>

        {/* Link Component */}
        <Box className="space-y-4">
          <Text as="h2" size="2xl" weight="semibold">
            Link Component
          </Text>
          <Box className="space-y-2 p-4 bg-white rounded-lg shadow">
            <Box className="flex flex-wrap gap-4">
              <Link href="#" size="sm">
                Small link
              </Link>
              <Link href="#">Default link</Link>
              <Link href="#" size="lg">
                Large link
              </Link>
              <Link href="#" weight="bold">
                Bold link
              </Link>
            </Box>
            <Box className="flex flex-wrap gap-4">
              <Link href="#" color="primary">
                Primary
              </Link>
              <Link href="#" color="secondary">
                Secondary
              </Link>
              <Link href="#" color="success">
                Success
              </Link>
              <Link href="#" color="error">
                Error
              </Link>
              <Link href="#" color="warning">
                Warning
              </Link>
            </Box>
            <Box className="flex flex-wrap gap-4">
              <Link href="#" underline="none">
                No underline
              </Link>
              <Link href="#" underline="hover">
                Hover underline (default)
              </Link>
              <Link href="#" underline="always">
                Always underlined
              </Link>
            </Box>
            <Box className="flex flex-wrap gap-4">
              <Link href="https://google.com" external>
                External link
              </Link>
              <Link href="#" disabled>
                Disabled link
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Combined Example */}
        <Box className="space-y-4">
          <Text as="h2" size="2xl" weight="semibold">
            Combined Example
          </Text>
          <Box
            p={6}
            bg="white"
            borderRadius="xl"
            shadow="lg"
            className="space-y-4"
          >
            <Box display="flex" alignItems="center" justifyContent="between">
              <Box>
                <Text as="h3" size="xl" weight="semibold">
                  Settings Panel
                </Text>
                <Text size="sm" color="muted">
                  Manage your preferences
                </Text>
              </Box>
              <Spinner size="sm" color="secondary" />
            </Box>

            <Box className="border-t pt-4 space-y-3">
              <Box display="flex" alignItems="center" justifyContent="between">
                <Text>Enable notifications</Text>
                <Switch checked={switchChecked} onChange={setSwitchChecked} />
              </Box>
              <Box display="flex" alignItems="center" justifyContent="between">
                <Text>Dark mode</Text>
                <Switch checked={labeledSwitch} onChange={setLabeledSwitch} />
              </Box>
            </Box>

            <Box className="flex gap-2 pt-4 border-t">
              <Link href="#" size="sm">
                Privacy Policy
              </Link>
              <Text size="sm" color="muted">
                •
              </Text>
              <Link href="#" size="sm">
                Terms of Service
              </Link>
              <Text size="sm" color="muted">
                •
              </Text>
              <Link href="#" size="sm" external>
                Documentation
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
